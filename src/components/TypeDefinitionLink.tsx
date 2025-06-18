import React from 'react';
import { Link } from 'react-router-dom';

interface TypeDefinitionLinkProps {
  /** The name of the TypeScript type to display. */
  typeName: string;
  /** If true, this type name links to its API detail page. Defaults to false. */
  isApiItem?: boolean;
}

const TypeDefinitionLink: React.FC<TypeDefinitionLinkProps> = ({
  typeName,
  isApiItem = false,
}) => {
  console.log(`TypeDefinitionLink loaded for: ${typeName}, isApiItem: ${isApiItem}`);

  if (isApiItem) {
    // Link to the API item detail page, passing the typeName as a query parameter.
    // The ApiItemDetailPage will be responsible for using this query parameter.
    return (
      <Link
        to={`/api-item-detail?name=${encodeURIComponent(typeName)}`}
        className="text-sky-600 dark:text-sky-400 hover:underline font-mono text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
        title={`View details for ${typeName}`}
      >
        {typeName}
      </Link>
    );
  }

  // Render as plain, styled text if not a linkable API item.
  return (
    <span className="text-pink-600 dark:text-pink-400 font-mono text-sm">
      {typeName}
    </span>
  );
};

export default TypeDefinitionLink;