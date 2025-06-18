import React from 'react';
import { TypeDefinitionLink } from '@/components/TypeDefinitionLink';
import { Badge } from '@/components/ui/badge';

interface ApiParameter {
  name: string;
  type: string;
  isOptional?: boolean;
  description?: string;
}

export interface ApiMemberDetailItemProps {
  kind: 'method' | 'property';
  name: string;
  description?: string;
  // For properties
  propertyType?: string;
  // For methods
  returnType?: string; // If undefined for a method, 'void' is assumed
  parameters?: ApiParameter[];
  // Optional: additional metadata like 'static', 'readonly', 'abstract' could be added as props
  // For simplicity, sticking to the core request.
}

const ApiMemberDetailItem: React.FC<ApiMemberDetailItemProps> = ({
  kind,
  name,
  description,
  propertyType,
  returnType,
  parameters = [], // Default to empty array for methods
}) => {
  console.log(`ApiMemberDetailItem loaded for: ${name} (${kind})`);

  return (
    <div className="py-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 group" id={`member-${name}`}>
      <div className="mb-3">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 inline-flex items-center">
          {name}
        </h3>
        <Badge variant="outline" className="ml-2 align-middle text-xs capitalize">
          {kind}
        </Badge>
      </div>

      {/* Constructed Signature for Methods */}
      {kind === 'method' && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md overflow-x-auto shadow-sm">
          <code className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{name}</span>
            (
            {parameters.map((param, index) => (
              <React.Fragment key={`${param.name}-${index}`}>
                <span className="text-slate-600 dark:text-slate-400">{param.name}</span>
                {param.isOptional && <span className="text-yellow-600 dark:text-yellow-400">?</span>}
                <span className="text-gray-500 dark:text-gray-400">: </span>
                <TypeDefinitionLink typeName={param.type} />
                {index < parameters.length - 1 && <span className="text-gray-500 dark:text-gray-400">, </span>}
              </React.Fragment>
            ))}
            )
            <span className="text-gray-500 dark:text-gray-400">: </span>
            {returnType ? (
              <TypeDefinitionLink typeName={returnType} />
            ) : (
              <span className="text-blue-500 dark:text-blue-400">void</span>
            )}
          </code>
        </div>
      )}

      {description && (
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{description}</p>
      )}

      {/* Property Type Details */}
      {kind === 'property' && propertyType && (
        <div className="mb-3">
          <strong className="text-gray-600 dark:text-gray-400 font-medium">Type:</strong>{' '}
          <TypeDefinitionLink typeName={propertyType} />
        </div>
      )}

      {/* Method Parameters Details */}
      {kind === 'method' && parameters.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Parameters</h4>
          <ul className="space-y-3 pl-1">
            {parameters.map((param) => (
              <li key={param.name} className="text-sm p-3 bg-white dark:bg-gray-800/30 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <code className="font-semibold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-1 rounded text-base">{param.name}</code>
                  {param.isOptional && <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>}
                  <span className="text-gray-500 dark:text-gray-400 mx-1">:</span>
                  <TypeDefinitionLink typeName={param.type} />
                </div>
                {param.description && (
                  <p className="pl-1 mt-1.5 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                    {param.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Method Return Type Details (if not already covered sufficiently by signature) */}
      {kind === 'method' && (
        <div>
          <strong className="text-gray-600 dark:text-gray-400 font-medium">Returns:</strong>{' '}
          {returnType ? (
            <TypeDefinitionLink typeName={returnType} />
          ) : (
            <code className="font-mono text-sm text-blue-600 dark:text-blue-400">void</code>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiMemberDetailItem;