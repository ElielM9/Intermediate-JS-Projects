import { execSync } from "child_process"; // Para ejecutar comandos de terminal
import { glob } from "glob"; // Para buscar archivos con patrones
import path from "path"; // Para manejar rutas de archivos
import fs from "fs"; // Para leer y escribir archivos

// 1. Buscamos todos los archivos .js en src/js y sus subcarpetas
const files = glob.sync(`src/js/**/*.js`);

files.forEach((file) => {
  // 2. Definimos la ruta de salida (cambiando 'src' por 'public')
  const outPath = file.replace('src', 'public');
  const outDIr = path.dirname(outPath);

  // 3. Creamos la carpeta de salida si no existe
  if (!fs.existsSync(outDIr)) {
    fs.mkdirSync(outDIr, { recursive: true });
  }

  // 4. Minificamos el archivo usando Terser
  const command = `npx terser ${file} -o ${outPath} --compress --mangle`;
  execSync(command);
  console.log(`Minificado: ${file} -> ${outPath}`);
});
