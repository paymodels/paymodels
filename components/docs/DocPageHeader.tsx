interface DocPageHeaderProps {
  title: string;
  description?: string;
}

export function DocPageHeader({ title, description }: DocPageHeaderProps) {
  return (
    <header className="mb-10 pb-6 border-b border-border/40">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
      )}
    </header>
  );
}
