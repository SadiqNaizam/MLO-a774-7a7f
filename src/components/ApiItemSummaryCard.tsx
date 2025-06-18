import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from 'lucide-react';

interface ApiItemSummaryCardProps {
  /** The display name of the API item (e.g., "AnimationDriver") */
  name: string;
  /** The kind of the API item for display (e.g., "Class", "Interface", "Function") */
  kind: string;
  /** A short description or the primary signature of the API item */
  summary: string;
  /** The unique identifier/name of the API item, used for constructing the link URL (e.g., "AnimationDriver") */
  itemName: string;
  /** The kind of the API item in a format suitable for URL parameter (e.g., "class", "interface") */
  itemKind: string;
}

const ApiItemSummaryCard: React.FC<ApiItemSummaryCardProps> = ({
  name,
  kind,
  summary,
  itemName,
  itemKind,
}) => {
  console.log(`ApiItemSummaryCard loaded for: ${name} (${kind})`);

  const detailPageLink = `/api-item-detail?name=${encodeURIComponent(itemName)}&kind=${encodeURIComponent(itemKind.toLowerCase())}`;

  return (
    <Card className="h-full flex flex-col transition-all duration-200 ease-in-out hover:shadow-lg hover:border-primary group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <Link 
        to={detailPageLink} 
        aria-label={`View details for ${name} (${kind})`}
        className="flex flex-col flex-grow h-full p-0 no-underline text-current rounded-lg focus:outline-none" // rounded-lg to match card if card has border radius
      >
        <CardHeader className="pb-3 pt-4 px-4 w-full">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-200 ease-in-out">
              {name}
            </CardTitle>
            <Badge variant="secondary" className="whitespace-nowrap shrink-0 capitalize">
              {kind}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow py-2 px-4 w-full">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {summary}
          </p>
        </CardContent>
        <CardFooter className="pt-3 pb-4 px-4 w-full">
          <div className="text-sm text-primary font-medium flex items-center">
            View Details
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ApiItemSummaryCard;