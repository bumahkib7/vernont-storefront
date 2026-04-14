"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/api";
import { ProductCardBlock } from "./ProductCardBlock";

// ── Types ──────────────────────────────────────────────────────────────────

export interface BlogBlock {
  type: string;
  [key: string]: unknown;
}

// ── Inline formatting helper ───────────────────────────────────────────────

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      nodes.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (match[2]) {
      nodes.push(<em key={match.index}>{match[2]}</em>);
    } else if (match[3] && match[4]) {
      nodes.push(
        <a
          key={match.index}
          href={match[4]}
          className="underline underline-offset-2 text-[#1A1A1A] hover:opacity-60 transition-opacity"
        >
          {match[3]}
        </a>
      );
    }
    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

// ── Individual block renderers ─────────────────────────────────────────────

function HeadingBlock({ block }: { block: BlogBlock }) {
  const level = (block.level as number) || 2;
  const text = (block.text as string) || "";
  const baseStyle = {
    fontFamily: "'Crimson Pro', Georgia, serif",
  };

  if (level === 3) {
    return (
      <h3
        className="text-xl tracking-wide text-[#1A1A1A] mt-10 mb-4"
        style={baseStyle}
      >
        {text}
      </h3>
    );
  }
  return (
    <h2
      className="text-2xl tracking-wide text-[#1A1A1A] mt-12 mb-5"
      style={baseStyle}
    >
      {text}
    </h2>
  );
}

function ParagraphBlock({ block }: { block: BlogBlock }) {
  const text = (block.text as string) || "";
  return (
    <p className="text-[15px] text-[#444] leading-relaxed mb-6">
      {parseInline(text)}
    </p>
  );
}

function ImageBlock({ block }: { block: BlogBlock }) {
  const src = resolveImageUrl(block.url as string) || "";
  const alt = (block.alt as string) || "";
  const caption = block.caption as string | undefined;
  const width = (block.width as number) || 800;
  const height = (block.height as number) || 450;

  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
        sizes="(max-width: 800px) 100vw, 800px"
      />
      {caption && (
        <figcaption className="text-xs text-[#999] mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function ProductComparisonBlock({ block }: { block: BlogBlock }) {
  const products = (block.products as string[]) || [];
  const features = (block.features as { label: string; values: string[] }[]) || [];

  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#E5E5E5]">
            <th className="text-left py-3 pr-4 text-[#999] font-normal text-xs uppercase tracking-wider">
              Feature
            </th>
            {products.map((name) => (
              <th
                key={name}
                className="text-left py-3 px-4 font-semibold text-[#1A1A1A] text-[13px]"
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.label} className="border-b border-[#F0F0F0]">
              <td className="py-3 pr-4 text-[#666] text-[13px]">
                {feature.label}
              </td>
              {feature.values.map((val, i) => (
                <td key={i} className="py-3 px-4 text-[#1A1A1A] text-[13px]">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalloutBlock({ block }: { block: BlogBlock }) {
  const icon = (block.icon as string) || "info";
  const title = (block.title as string) || "";
  const text = (block.text as string) || "";

  const colorMap: Record<string, { border: string; bg: string; icon: string }> = {
    shield: { border: "border-green-500", bg: "bg-green-50", icon: "text-green-600" },
    info: { border: "border-blue-500", bg: "bg-blue-50", icon: "text-blue-600" },
    warning: { border: "border-amber-500", bg: "bg-amber-50", icon: "text-amber-600" },
  };
  const colors = colorMap[icon] || colorMap.info;

  return (
    <div className={`my-8 border-l-4 ${colors.border} ${colors.bg} p-5`}>
      {title && (
        <p className={`font-semibold text-sm mb-1 ${colors.icon}`}>{title}</p>
      )}
      <p className="text-[14px] text-[#444] leading-relaxed">
        {parseInline(text)}
      </p>
    </div>
  );
}

function FaqBlock({ block }: { block: BlogBlock }) {
  const items = (block.items as { question: string; answer: string }[]) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="my-8 divide-y divide-[#E5E5E5] border-t border-b border-[#E5E5E5]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex items-center justify-between w-full py-4 text-left"
            aria-expanded={openIndex === i}
          >
            <span className="font-semibold text-[14px] text-[#1A1A1A]">
              {item.question}
            </span>
            <span className="text-[#999] ml-4 flex-shrink-0 text-lg leading-none">
              {openIndex === i ? "\u2212" : "+"}
            </span>
          </button>
          {openIndex === i && (
            <div className="pb-4 text-[14px] text-[#444] leading-relaxed">
              {parseInline(item.answer)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CtaBlock({ block }: { block: BlogBlock }) {
  const text = (block.text as string) || "Learn More";
  const url = (block.url as string) || "#";
  const variant = (block.variant as string) || "primary";

  const isPrimary = variant === "primary";
  return (
    <div className="my-8 flex justify-center">
      <Link
        href={url}
        className={`px-8 py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium transition-colors ${
          isPrimary
            ? "bg-[#1A1A1A] text-white hover:bg-black"
            : "border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
        }`}
      >
        {text}
      </Link>
    </div>
  );
}

function QuoteBlock({ block }: { block: BlogBlock }) {
  const text = (block.text as string) || "";
  const attribution = block.attribution as string | undefined;

  return (
    <blockquote className="my-8 border-l-4 border-[#1A1A1A] pl-6 py-2">
      <p
        className="text-lg text-[#333] italic leading-relaxed"
        style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
      >
        &ldquo;{text}&rdquo;
      </p>
      {attribution && (
        <cite className="block mt-3 text-sm text-[#999] not-italic">
          &mdash; {attribution}
        </cite>
      )}
    </blockquote>
  );
}

function DividerBlock() {
  return <hr className="border-[#E5E5E5] my-8" />;
}

// ── Main renderer ──────────────────────────────────────────────────────────

interface BlockRendererProps {
  blocks: BlogBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="blog-blocks">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return <HeadingBlock key={i} block={block} />;
          case "paragraph":
            return <ParagraphBlock key={i} block={block} />;
          case "image":
            return <ImageBlock key={i} block={block} />;
          case "product-card":
            return (
              <ProductCardBlock key={i} productId={block.productId as string} />
            );
          case "product-comparison":
            return <ProductComparisonBlock key={i} block={block} />;
          case "callout":
            return <CalloutBlock key={i} block={block} />;
          case "faq":
            return <FaqBlock key={i} block={block} />;
          case "cta":
            return <CtaBlock key={i} block={block} />;
          case "quote":
            return <QuoteBlock key={i} block={block} />;
          case "divider":
            return <DividerBlock key={i} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
