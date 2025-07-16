from cx_Freeze import setup, Executable

build_exe_options = {
    "packages": ["os", "django", "dotenv", "requests", "pymongo"],
    "includes": ["django.conf", "django.core", "django.template", "django.templatetags"],
    "zip_exclude_packages": ["*"],
    "include_files": [
        ("frontend_build", "frontend_build"),
        (".env", ".env"),
        ("Backend", "Backend"),
        ("core", "core"),
        ("sales", "sales"),
        ("inventory", "inventory"),
        ("purchases", "purchases"),
        ("staticfiles", "staticfiles"),
        ("run_app.py", "run_app.py"),
        ("manage.py", "manage.py"),
    ],
}

setup(
    name="InventoryManagementApp",
    version="1.0",
    description="Inventory Management System",
    options={"build_exe": build_exe_options},
    executables=[Executable("run_app.py")]
)
