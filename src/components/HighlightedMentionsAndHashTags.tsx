import parse, { Element, domToReact } from 'html-react-parser';
import Link from 'next/link';
export function HighlightedMentionsAndHashTags({
  text,
  shouldAddLinks,
}: {
  text: string;
  shouldAddLinks?: boolean;
}) {
  /**
   * Define a regex pattern to match words that begin with `@` or `#`
   *
   * * The first group matches either the start of a line (^) or a whitespace character (\s)
   * * The second word matches the word which is preceded by `@` or `#`
   */
  const pattern = /(^|\s)(@\w+|#\w+)/g;

  // Use replace() method to surround the matches' word with the <span> tag
  const html = text.replace(pattern, (match, space: string, word: string) => {
    const coloredWord = `<span class="text-blue-600 hover:underline">${word}</span>`;
    if (!shouldAddLinks) return `${space}${coloredWord}`;
    return `${space}<a href="/${word.slice(1)}">${coloredWord}</a>`;
  });

  if (!shouldAddLinks) return parse(html) as JSX.Element;
  return parse(html, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs && domNode.children)
        return (
          <Link href={domNode.attribs.href}>
            {domToReact(domNode.children)}
          </Link>
        );
    },
  }) as JSX.Element;
}
