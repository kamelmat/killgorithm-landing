import bpy
import os
import math

print("Base path:", base_path)
print("Image folder:", img_folder)
for file in os.listdir(img_folder):
    print("Found image:", file)

# Limpia la escena
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Ruta base del archivo .blend
base_path = bpy.path.abspath("//")

# Carpeta con las imágenes
img_folder = os.path.join(base_path, "reference")

# Diccionario de imágenes
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

# Crea los planos con las imágenes
plane_size = 2
angle_step = 360 / len(image_files)
radius = 5
i = 0

for name, filename in image_files.items():
    image_path = os.path.join(img_folder, filename)
    
    # Carga la imagen
    img = bpy.data.images.load(image_path)
    
    # Crea un material con la imagen
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    
    tex_image = mat.node_tree.nodes.new("ShaderNodeTexImage")
    tex_image.image = img
    mat.node_tree.links.new(bsdf.inputs['Base Color'], tex_image.outputs['Color'])
    
    # Crea un plano
    bpy.ops.mesh.primitive_plane_add(size=plane_size)
    plane = bpy.context.active_object
    plane.name = f"Plane_{name}"
    plane.data.materials.append(mat)

    # Ubica el plano en círculo
    angle = math.radians(i * angle_step)
    plane.location.x = radius * math.cos(angle)
    plane.location.y = radius * math.sin(angle)
    plane.rotation_euler.z = angle + math.pi
    i += 1

# Crea un cubo en el centro
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))

# Crea la cámara
bpy.ops.object.camera_add(location=(0, -7, 2), rotation=(math.radians(75), 0, 0))
camera = bpy.context.active_object
bpy.context.scene.camera = camera

# Crea un empty en el centro para animar la cámara alrededor
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
pivot = bpy.context.active_object

# Parentea la cámara al empty
camera.parent = pivot

# Inserta keyframes para animar el empty
pivot.rotation_mode = 'XYZ'
pivot.keyframe_insert(data_path="rotation_euler", frame=1)

pivot.rotation_euler[2] = math.radians(360)
pivot.keyframe_insert(data_path="rotation_euler", frame=250)

# Ajusta interpolación a lineal
for fcurve in pivot.animation_data.action.fcurves:
    for keyframe in fcurve.keyframe_points:
        keyframe.interpolation = 'LINEAR'
