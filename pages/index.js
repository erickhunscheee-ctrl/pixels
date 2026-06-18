import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Script from 'next/script';

const HTML_PATH = path.join(process.cwd(), 'content', 'pixels.template.html');
const FALLBACK_TITLE = 'Pixels. \u2014 Est\u00FAdio de Plataformas Digitais';

function extractSection(source, pattern) {
  const match = source.match(pattern);
  return match?.[1]?.trim() ?? '';
}

export async function getStaticProps() {
  const raw = fs.readFileSync(HTML_PATH, 'utf8');

  const title = extractSection(raw, /<title>([\s\S]*?)<\/title>/i) || FALLBACK_TITLE;
  const styles = extractSection(raw, /<style>([\s\S]*?)<\/style>/i);
  const body = extractSection(raw, /<body>([\s\S]*?)<script>/i);
  const script = extractSection(raw, /<script>([\s\S]*?)<\/script>\s*<\/body>/i);

  return {
    props: {
      title,
      styles,
      body,
      script,
    },
  };
}

export default function Home({ title, styles, body, script }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <Script id="pixels-inline-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
