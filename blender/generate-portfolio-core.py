"""Build the V2 desk. Historical filename kept for reproducible commands."""
import json
import math
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parent.parent
TOKENS = json.loads((ROOT / 'src' / 'tokens.json').read_text(encoding='utf-8'))
bpy.ops.wm.read_factory_settings(use_empty=True)

def linear(channel):
    return channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4

def material(token, metallic=0.0):
    value = TOKENS[token].lstrip('#')
    rgb = tuple(linear(int(value[i:i+2], 16) / 255) for i in (0, 2, 4))
    mat = bpy.data.materials.new(token)
    mat.diffuse_color = (*rgb, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*rgb, 1)
    shader.inputs['Metallic'].default_value = metallic
    shader.inputs['Roughness'].default_value = 0.48
    return mat

mats = {token: material(token) for token in ['scene-wood', 'brand', 'scene-screen', 'scene-metal', 'surface', 'accent', 'scene-leaf', 'brand-soft']}

def box(name, xyz, size, token, bevel=0.04):
    bpy.ops.mesh.primitive_cube_add(location=xyz)
    obj = bpy.context.object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    modifier = obj.modifiers.new('Soft edges', 'BEVEL')
    modifier.width = bevel
    modifier.segments = 3
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.data.materials.append(mats[token])
    return obj

def cylinder(name, xyz, radius, depth, token):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=radius, depth=depth, location=xyz)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mats[token])
    bevel = obj.modifiers.new('Soft edges', 'BEVEL'); bevel.width = 0.025; bevel.segments = 3
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    return obj

box('Desktop', (0, 0, 0.1), (1.85, 1, 0.1), 'scene-wood', 0.12)
box('Desk mat', (0, -0.24, 0.215), (1.08, 0.62, 0.015), 'brand-soft', 0.09)
box('Monitor foot', (0, 0.3, 0.25), (0.4, 0.28, 0.04), 'scene-metal')
box('Monitor stand', (0, 0.42, 0.57), (0.075, 0.06, 0.32), 'scene-metal')
box('Monitor frame', (0, 0.34, 1.25), (1.02, 0.08, 0.62), 'brand', 0.08)
box('Monitor screen', (0, 0.248, 1.28), (0.93, 0.015, 0.52), 'scene-screen', 0.04)
for i, width in enumerate([0.42, 0.28, 0.55, 0.37, 0.47]):
    box(f'Code line {i}', (-0.65 + width / 2, 0.225, 1.62 - i * 0.15), (width / 2, 0.012, 0.018), 'accent' if i % 2 == 0 else 'brand-soft', 0.012)
box('Keyboard', (0, -0.43, 0.28), (0.68, 0.24, 0.055), 'scene-metal')
for row in range(3):
    for col in range(11):
        box(f'Key {row}-{col}', (-0.56 + col * 0.112, -0.57 + row * 0.14, 0.35), (0.043, 0.043, 0.02), 'surface', 0.015)
box('Space', (0, -0.69, 0.35), (0.23, 0.035, 0.02), 'surface', 0.015)
box('Notebook', (-1.35, -0.1, 0.27), (0.29, 0.39, 0.05), 'brand')
box('Notebook label', (-1.35, -0.22, 0.325), (0.15, 0.035, 0.006), 'accent', 0.004)
cylinder('Cup', (1.25, -0.5, 0.44), 0.18, 0.45, 'surface')
bpy.ops.mesh.primitive_torus_add(major_radius=0.14, minor_radius=0.035, major_segments=24, minor_segments=8, location=(1.46, -0.5, 0.46), rotation=(math.pi/2, 0, 0))
bpy.context.object.name = 'Cup handle'; bpy.context.object.data.materials.append(mats['surface'])
cylinder('Cup opening', (1.25, -0.5, 0.67), 0.14, 0.01, 'scene-screen')
cylinder('Planter', (1.35, 0.55, 0.44), 0.22, 0.45, 'brand-soft')
for i in range(7):
    angle = i * math.tau / 7
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, location=(1.35 + math.cos(angle)*0.12, 0.55 + math.sin(angle)*0.12, 0.93))
    obj = bpy.context.object; obj.name = f'Leaf {i}'; obj.scale = (0.075, 0.05, 0.36)
    obj.rotation_euler = (math.sin(angle)*0.42, math.cos(angle)*0.42, angle)
    obj.data.materials.append(mats['scene-leaf'])

bpy.ops.object.select_all(action='SELECT')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / 'blender' / 'portfolio-studio.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT / 'public' / 'models' / 'portfolio-studio.glb'), export_format='GLB', use_selection=True, export_apply=True)
print('V2 studio exported with shared semantic tokens.')
