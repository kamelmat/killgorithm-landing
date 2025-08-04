import bpy
import os

# Elimina todos los objetos
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Ruta base del proyecto
base_path = "/Users/user/Documents/code/killgorithm/blender/nautilus_views"
ref_path = os.path.join(base_path, "reference")

# Diccionario con vistas y archivos de imagen
image_files = {
    "back": "nautilus_back.jpg",
    "far": "nautilus_far.jpg",
    "forn_lights": "nautilus_forn_lights.jpg",
    "front": "nautilus_front.jpg",
    "full_side_right": "nautilus_full_side_right.jpg",
    "right_profile": "nautilus_righ_profile.jpg",  # nombre original en carpeta
    "turn": "nautilus_turn.jpg",
    "right": "nautilusright.jpg"
}

# Crea un cubo para tener de referencia
bpy.ops.mesh.primitive_cube_add(size=2)

# Función para crear plano con imagen
def create_image_plane(name, img_path, location, rotation):
    # Cargar imagen
    img = bpy.data.images.load(img_path)

    # Crear material
    mat = bpy.data.materials.new(name + "_Mat")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    tex_image = mat.node_tree.nodes.new('ShaderNodeTexImage')
    tex_image.image = img
    mat.node_tree.links.new(bsdf.inputs['Base Color'], tex_image.outputs['Color'])

    # Crear plano
    bpy.ops.mesh.primitive_plane_add(size=2, location=location, rotation=rotation)
    plane = bpy.context.object
    plane.name = name
    plane.data.materials.append(mat)

# Parámetros para ubicación y rotación de cada imagen
positions = {
    "front": ((0, -3, 0), (0, 0, 0)),
    "back": ((0, 3, 0), (0, 0, 3.1416)),
    "right": ((3, 0, 0), (0, 0, 1.5708)),
    "right_profile": ((3, 0, 2), (0, 0, 1.5708)),
    "far": ((0, -5, 0), (0, 0, 0)),
    "forn_lights": ((-3, 0, 0), (0, 0, -1.5708)),
    "full_side_right": ((3, 0, -2), (0, 0, 1.5708)),
    "turn": ((0, 0, 3), (1.5708, 0, 0)),
}

# Crear los planos
for name, filename in image_files.items():
    full_path = os.path.join(ref_path, filename)
    if os.path.exists(full_path):
        loc, rot = positions.get(name, ((0, 0, 0), (0, 0, 0)))
        create_image_plane(name, full_path, loc, rot)
    else:
        print(f"⚠️ Imagen no encontrada: {filename}")
