import bpy
import os

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Set paths
ref_path = os.path.join(os.path.dirname(__file__), "references")
export_path = os.path.join(os.path.dirname(__file__), "export")
os.makedirs(export_path, exist_ok=True)

# Image names (should match actual files)
image_files = {
    "back": "nautilus_back.png",
    "far": "nautilus_far.png",
    "forn_lights": "nautilus_forn_lights.png",
    "front": "nautilus_front.png",
    "full_side_right": "nautilus_full_side_right.png",
    "right_profile": "nautilus_righ_profile.png",
    "turn": "nautilus_turn.png",
    "right": "nautilusright.png"
}

# Load images as reference planes
for name, filename in image_files.items():
    img_path = os.path.join(ref_path, filename)
    bpy.ops.import_image.to_plane(files=[{"name": filename}], directory=ref_path)
    plane = bpy.context.selected_objects[0]
    plane.name = name

    # Align reference planes depending on view
    if "front" in name:
        plane.rotation_euler = (0, 0, 0)
        plane.location = (0, -1, 0)
    elif "back" in name:
        plane.rotation_euler = (0, 3.1415, 0)
        plane.location = (0, 1, 0)
    elif "right" in name:
        plane.rotation_euler = (0, 1.5708, 0)
        plane.location = (-1, 0, 0)
    elif "left" in name:
        plane.rotation_euler = (0, -1.5708, 0)
        plane.location = (1, 0, 0)
    else:
        plane.rotation_euler = (0, 0, 0)

# Add a cube as base for modeling (replace later with sculpt)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
model = bpy.context.object
model.name = "Nautilus_Base"

# Add cyberpunk-style material
material = bpy.data.materials.new(name="CyberpunkShader")
material.use_nodes = True
nodes = material.node_tree.nodes
bsdf = nodes.get("Principled BSDF")
bsdf.inputs["Base Color"].default_value = (0.0, 0.3, 1.0, 1)  # Blue
bsdf.inputs["Metallic"].default_value = 1.0
bsdf.inputs["Roughness"].default_value = 0.25
model.data.materials.append(material)

# Export as GLTF (binary .glb)
bpy.ops.export_scene.gltf(filepath=os.path.join(export_path, "nautilus_model.glb"))
