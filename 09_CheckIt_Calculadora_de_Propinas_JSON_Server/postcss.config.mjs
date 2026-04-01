import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import purgecss from '@fullhuman/postcss-purgecss';
import cssnano from 'cssnano';

export default {
  plugins: [
    postcssImport,
    autoprefixer,
    purgecss({
      content: ["./src/views/**/*.html", "./src/js/**/*.js"],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        standard: [
          /^modal/,
          /^btn/,
          /^form-/,
          /^card/,
          /^row/,
          /^col/,
          /^bg-/,
          /^text-/,
          /^p-/,
          /^m-/,
          /^d-/,
          /^gap-/,
          /^rounded/,
          /^shadow/,
          /^position-/,
          /^overflow-/,
          /^sticky-/,
          /^opacity-/,
          /^display-/,
          /^justify-/,
          /^align-/,
          /^h-/,
          /^w-/,
          /^fs-/,
          /^fw-/,
          /^lead/,
          /^badge/,
          /^show/,
          /^fade/,
          /^active/,
          /^disabled/,
          "modal-backdrop",
          "modal-open",
        ],
        // Whitelist completo para Bootstrap Icons
        greedy: [/^bi/],
      },
    }),
    cssnano({
      preset: "default",
    }),
  ],
};
