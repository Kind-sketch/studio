"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollapsibleDivProps {
  title?: string;
  initialExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleDiv({
  title = "Collapsible Section",
  initialExpanded = false,
  children,
  className,
}: CollapsibleDivProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  // Measure content height for smooth max-height transition
  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    }
  }, [children, expanded]);

  return (
    <div className={cn("border rounded-md bg-muted/30", className)}>
      <div className="flex items-center justify-between p-3">
        <span className="font-medium">{title}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="group"
        >
          <span className="mr-2 text-sm">
            {expanded ? "Collapse" : "Expand"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              expanded ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      </div>
      <div
        ref={contentRef}
        className={cn(
          "overflow-hidden transition-all duration-300",
          expanded ? "opacity-100" : "opacity-0"
        )}
        style={{ maxHeight: expanded ? maxHeight : 0 }}
        aria-hidden={!expanded}
      >
        <div className="p-3 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleDiv;