"""Local raster-to-path conversion. Run through npm run assets."""
import sys
import vtracer

vtracer.convert_image_to_svg_py(
    sys.argv[1], sys.argv[2],
    colormode='color', hierarchical='stacked', mode='spline',
    filter_speckle=6, color_precision=6, layer_difference=16,
    corner_threshold=60, length_threshold=5.0,
    max_iterations=10, splice_threshold=45, path_precision=2,
)
