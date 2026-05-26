import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
    return (
        <fieldset
            data-slot="field-set"
            className={cn('flex min-w-0 flex-col gap-6', className)}
            {...props}
        />
    );
}

function FieldLegend({
    className,
    variant = 'legend',
    ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
    return (
        <legend
            data-slot="field-legend"
            className={cn(
                variant === 'legend'
                    ? 'text-foreground text-base font-medium'
                    : 'text-sm font-medium',
                className
            )}
            {...props}
        />
    );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div data-slot="field-group" className={cn('flex flex-col gap-6', className)} {...props} />
    );
}

function Field({
    className,
    orientation = 'vertical',
    ...props
}: React.ComponentProps<'div'> & { orientation?: 'vertical' | 'horizontal' | 'responsive' }) {
    return (
        <div
            data-slot="field"
            role="group"
            className={cn(
                'group/field flex w-full gap-3 data-disabled:opacity-50',
                orientation === 'vertical' && 'flex-col',
                orientation === 'horizontal' && 'flex-row items-center',
                orientation === 'responsive' &&
                    'flex-col @md/field-group:flex-row @md/field-group:items-center',
                className
            )}
            {...props}
        />
    );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="field-content"
            className={cn('flex flex-1 flex-col gap-1.5 leading-none', className)}
            {...props}
        />
    );
}

function FieldLabel({
    className,
    asChild = false,
    ...props
}: React.ComponentProps<'label'> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'label';

    return (
        <Comp
            data-slot="field-label"
            className={cn(
                'text-sm leading-none font-medium select-none group-data-[disabled=true]/field:pointer-events-none group-data-[disabled=true]/field:opacity-50',
                className
            )}
            {...props}
        />
    );
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="field-title"
            className={cn('text-sm leading-none font-medium', className)}
            {...props}
        />
    );
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
    return (
        <p
            data-slot="field-description"
            className={cn('text-muted-foreground text-sm leading-relaxed', className)}
            {...props}
        />
    );
}

function FieldSeparator({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="field-separator"
            className={cn('bg-border h-px w-full', className)}
            {...props}
        />
    );
}

function FieldError({
    className,
    children,
    errors,
    ...props
}: React.ComponentProps<'div'> & { errors?: Array<{ message?: string } | undefined> }) {
    const messages = errors?.map((error) => error?.message).filter(Boolean);

    if (!children && !messages?.length) {
        return null;
    }

    return (
        <div
            data-slot="field-error"
            className={cn('text-destructive text-sm font-medium', className)}
            {...props}
        >
            {children ?? messages?.join(', ')}
        </div>
    );
}

export {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
};
