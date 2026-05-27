interface DocPageHeaderProps {
  title: string;
  description?: string;
}

export function DocPageHeader({ title, description }: DocPageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
