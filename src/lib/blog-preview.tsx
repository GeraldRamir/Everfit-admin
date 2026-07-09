function parseBlogPreview(content: string) {
  const blocks: Array<
    | { type: "h2"; text: string }
    | { type: "h3"; text: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "quote"; text: string }
  > = [];
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length) {
      blocks.push({ type: "ul", items: [...listItems] });
      listItems = [];
    }
  }

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
    } else if (line.startsWith("## ")) {
      flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("> ")) {
      flushList();
      blocks.push({ type: "quote", text: line.slice(2).trim() });
    } else if (/^[-•*]\s+/.test(line)) {
      listItems.push(line.replace(/^[-•*]\s+/, "").trim());
    } else {
      flushList();
      blocks.push({ type: "p", text: line });
    }
  }
  flushList();
  return blocks;
}

function BlogPreviewBody({ content }: { content: string }) {
  const blocks = parseBlogPreview(content);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-[var(--admin-muted)]">
      {blocks.map((block, i) => {
        if (block.type === "h2") {
          return (
            <p key={i} className="mb-0 font-display text-base font-bold text-everfit-charcoal">
              {block.text}
            </p>
          );
        }
        if (block.type === "h3") {
          return (
            <p key={i} className="mb-0 font-display text-sm font-semibold text-everfit-charcoal">
              {block.text}
            </p>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={i}
              className="rounded-xl border-l-4 border-everfit-orange bg-[var(--admin-surface-soft)] px-4 py-3 italic text-everfit-charcoal"
            >
              {block.text}
            </blockquote>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="list-inside list-disc space-y-1 pl-1">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="mb-0">{block.text}</p>;
      })}
    </div>
  );
}

export type BlogDetailItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string | null;
  published?: boolean;
  publishedAt: string;
};

export { BlogPreviewBody };
