# TailwindCSS → Style Dictionary → Figma Tokens

![](https://progress-bar.dev/43?title=progress) 

What‘s an equivalent of Tailwind‘s `p-4` on the design side? This is an attempt to make the designer productive and accurate by using “default” tokens (in my case, Tailwind) in Figma! 

Today I have to recreate all these default tokens from the UI tool, which is prone to human error. So I figured one of the ways is we pull Tailwind's full default config and transform them into a format that Figma Tokens can consume.

Thanks to this tutorial by [@philwolstenholme](https://github.com/philwolstenholme) on [dev.to](https://dev.to/philw_/using-style-dictionary-to-transform-tailwind-config-into-scss-variables-css-custom-properties-and-javascript-via-design-tokens-24h5), we managed these token types so far:

- Spacing ✅
- Colors ✅
- Border Radius ✅
- Border Width ✅
- Opacity ✅
- Box Shadow ✅
- Line Heights ✅ (hat tip to [@sonnylazuardi](https://github.com/sonnylazuardi))
- Letter Spacing 🐞 (em doesn‘t seem to work on Figma)

#### Need help with
- Sizing
- Typography
- Font Family
- Font Weight
- Font Size
- Paragraph Spacing
- Text Case
- Text Decoration
- _Composition (if available)_

<hr/> 

**Notice the `Other` panel**. Technically, each token type should be transformed correctly.

<kbd><img src="https://user-images.githubusercontent.com/827167/190056452-13f2bd83-63a5-4cba-970a-e92e6126417e.png"/></kbd>

<hr/> 

### Credits, References & Resources

- https://dev.to/philw_/using-style-dictionary-to-transform-tailwind-config-into-scss-variables-css-custom-properties-and-javascript-via-design-tokens-24h5

- [@sonnylazuardi](https://github.com/sonnylazuardi)‘s contribution
