interface DocStepItemProps {
    title: string;
    description?: string;
}

export function DocStepItem({ title, description }: DocStepItemProps) {
    return (
        <li>
            <strong>{title}</strong>
            {description && <p className="mt-2 ml-6 text-foreground/80">{description}</p>}
        </li>
    );
}
