/* Importar funciones de gulp */
import gulp from "gulp";
const { src, dest, watch, parallel } = gulp;

// Plugins HTML
import htmlMin from "gulp-htmlmin";

// Plugins CSS
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import clean from "gulp-purgecss";

// Plugins JS
import terser from "gulp-terser-js";

// Plugins extra
import plumber from "gulp-plumber";
import concat from "gulp-concat";
import cacheBust from "gulp-cache-bust";
import sourcemaps from "gulp-sourcemaps";

// Funciones

/** HTML
 * Toma todos los archivos HTML en la carpeta `src/views`, las minimiza, agrega una marca de tiempo al nombre del archivo, y los envía a la carpeta `public`
 * @param done - Esta es una función callback que le dice a gulp cuando la tarea se completó.
 */
export function html(done) {
  const options = {
    collapseWhitespace: true,
    removeComments: true,
  };
  const cache = {
    type: `timestamp`,
  };

  src(`src/views/**/*.html`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(htmlMin(options))
    .pipe(cacheBust(cache))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest("public/"));

  done();
}

/** CSS
 * Toma todos los archivos SCSS en la carpeta src/scss, los compila y concatena en un solo archivo styles.css, agrega prefijos de proveedores  a las reglas de CSS, minifica, y escribe un sourcemap en la carpeta public/styles
 * @param done - Es una función callback que indica a gulp cuando la tarea terminó.
 */
export function css(done) {
  const cssPlugins = [autoprefixer(), cssnano()];

  src(`src/styles/**/*.css`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat(`styles.css`))
    .pipe(postcss(cssPlugins))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`public/styles`));

  done();
}

/**
 * Esta función limpia los estilos que no se usan
 * @param done - Es una función callback que indica a gulp cuando la tarea terminó.
 */
export function cleanCSS(done) {
  const content = {
    content: [`public/*.html`],
  };

  src(`public/styles/styles.css`)
    .pipe(clean(content))
    .pipe(dest(`public/styles`));

  done();
}

/** JS
 * Minifica y genera sourcemaps para todos los archivos JS en `src/js` y los pasa a `public/js`.
 */
export function js(done) {
  src(`src/js/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(terser())
    .pipe(sourcemaps.write())
    .pipe(dest(`public/js`));

  done();
}

/**
 * Observa los cambios en el HTML, CSS, y las imágenes y corre las tareas respectivas para ejecutar los cambios detectados.
 * @param done - Es una función callback que indica a gulp cuando la tarea terminó.
 */
export function dev(done) {
  watch(`src/views/**/*.html`, html);
  watch(`src/styles/**/*.css`, css);
  watch(`src/js/**/*.js`, js);

  done();
}

/* Exporta las funciones que se utilizan en el gulpfile.js */
export default parallel(dev);
