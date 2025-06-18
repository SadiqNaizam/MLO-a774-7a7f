import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Custom Components
import ApiMemberDetailItem, { ApiMemberDetailItemProps } from '@/components/ApiMemberDetailItem';
import SyntaxHighlightedCodeBlock from '@/components/SyntaxHighlightedCodeBlock';
import TypeDefinitionLink from '@/components/TypeDefinitionLink';

// Shadcn/ui Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge'; // For displaying item kind

// Mock Data Interface
interface ApiParameter {
  name: string;
  type: string;
  isOptional?: boolean;
  description?: string;
}
interface ApiItemData {
  name: string;
  kind: string; // 'Class', 'Function', 'Interface', etc.
  description: string;
  docSummary?: string;
  properties?: ApiMemberDetailItemProps[]; // Re-using ApiMemberDetailItemProps for structure
  methods?: ApiMemberDetailItemProps[]; // Re-using ApiMemberDetailItemProps for structure
  parameters?: ApiParameter[]; // For functions
  returnType?: string; // For functions
  exampleCode?: string;
  extends?: string;
  implements?: string[];
}

// Mock API Data (as discussed in thought process)
const MOCK_API_DATA: Record<string, ApiItemData> = {
  AnimationDriver: {
    name: 'AnimationDriver',
    kind: 'Class',
    description: 'An abstract class that provides a basis for driving animations. It is an injectable class that is available under the `AnimationDriver` token. This class is part of the browser animation module. For example, the `BrowserAnimationDriver` is the default driver.',
    docSummary: 'Represents a driver for animations.',
    properties: [
      {
        kind: 'property',
        name: 'supportsWebAnimations',
        propertyType: 'boolean',
        description: 'Indicates whether the current driver supports web animations.',
      },
    ],
    methods: [
      {
        kind: 'method',
        name: 'validateStyleProperty',
        parameters: [{ name: 'prop', type: 'string', description: 'The CSS property to validate.' }],
        returnType: 'boolean',
        description: 'Validates a CSS style property string.',
      },
      {
        kind: 'method',
        name: 'animate',
        parameters: [
          { name: 'element', type: 'any', description: 'The element to animate.' },
          { name: 'keyframes', type: 'Array<{[key: string]: string | number}>', description: 'A list of keyframes.' },
          { name: 'duration', type: 'number', description: 'The duration of the animation in milliseconds.' },
          { name: 'delay', type: 'number', description: 'The delay of the animation in milliseconds.' },
          { name: 'easing', type: 'string | null', isOptional: true, description: 'The easing function to use.' },
          { name: 'previousPlayers', type: 'any[]', isOptional: true, description: 'An array of previous players.' },
        ],
        returnType: 'AnimationPlayer',
        description: 'Runs an animation sequence.',
      },
    ],
    exampleCode: `import { AnimationDriver } from '@angular/animations/browser';\n\n// Example usage (conceptual)\n// const driver: AnimationDriver = getAnimationDriver();\n// if (driver.supportsWebAnimations) {\n//   console.log('Web Animations are supported!');\n// }`,
    extends: 'BaseAnimationDriver', // Example, assuming BaseAnimationDriver is another API item
  },
  ɵcreateEngine: {
    name: 'ɵcreateEngine',
    kind: 'Function',
    description: 'A factory function that creates an `AnimationEngine` instance. This is an internal function and not meant for public use, hence the ɵ prefix.',
    docSummary: 'Creates a new animation engine.',
    parameters: [
      { name: 'type', type: "'ng' | 'css'", description: 'The type of engine to create.' },
      { name: 'driver', type: 'AnimationDriver', description: 'The animation driver to use.' },
      { name: 'normalizer', type: 'AnimationNormalizer', description: 'The normalizer for animation styles.' },
    ],
    returnType: 'AnimationEngine',
    exampleCode: `import { ɵcreateEngine } from '@angular/animations/browser';\n// import { BrowserAnimationDriver } from '@angular/animations/browser';\n// import { WebAnimationsStyleNormalizer } from '@angular/animations/browser';\n\n// Example of how it might be used internally\n// const driver = new BrowserAnimationDriver();\n// const normalizer = new WebAnimationsStyleNormalizer();\n// const engine = ɵcreateEngine('css', driver, normalizer);\n// console.log('Engine created:', engine);`,
  },
  AnimationPlayer: {
    name: 'AnimationPlayer',
    kind: 'Interface',
    description: 'An interface for an animation player that controls an animation. It is returned by the `animate` method of `AnimationDriver`.',
    docSummary: 'Controls an animation instance.',
    methods: [
        { name: 'play', kind: 'method', description: 'Plays the animation.'},
        { name: 'pause', kind: 'method', description: 'Pauses the animation.'},
        { name: 'finish', kind: 'method', description: 'Finishes the animation.'},
        { name: 'destroy', kind: 'method', description: 'Destroys the animation player and cleans up resources.'},
        { name: 'onDone', kind: 'method', parameters: [{ name: 'fn', type: '() => void', description: 'Callback function to be invoked when the animation finishes.'}] , description: 'Registers a callback to be invoked when the animation finishes.'},
        { name: 'onStart', kind: 'method', parameters: [{ name: 'fn', type: '() => void', description: 'Callback function to be invoked when the animation starts.'}] , description: 'Registers a callback to be invoked when the animation starts.'},
    ],
    properties: [
        { name: 'totalTime', kind: 'property', propertyType: 'number', description: 'The total time of the animation in milliseconds.'},
        { name: 'parentPlayer', kind: 'property', propertyType: 'AnimationPlayer | null', isOptional: true, description: 'The parent player, if this player is part of a group or sequence.'},
    ],
    implements: ['Destructible'], // Example
  },
  // Add other referenced types as basic stubs if needed for TypeDefinitionLink to work
  BaseAnimationDriver: { name: 'BaseAnimationDriver', kind: 'Class', description: 'A base class for animation drivers.', docSummary: 'Base for animation drivers.' },
  AnimationEngine: { name: 'AnimationEngine', kind: 'Class', description: 'Core animation engine.', docSummary: 'Manages animation execution.' },
  AnimationNormalizer: { name: 'AnimationNormalizer', kind: 'Interface', description: 'Normalizes animation style properties.', docSummary: 'Normalizes styles.' },
  Destructible: { name: 'Destructible', kind: 'Interface', description: 'Interface for objects that can be destroyed.', docSummary: 'Can be destroyed.' },
};


const ApiItemDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const itemName = searchParams.get('name');
  // const itemKindFromQuery = searchParams.get('kind'); // Available if needed for disambiguation

  const [apiItemData, setApiItemData] = useState<ApiItemData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ApiItemDetailPage loaded or name changed');
    if (itemName) {
      const data = MOCK_API_DATA[itemName];
      if (data) {
        setApiItemData(data);
        setError(null);
      } else {
        setApiItemData(null);
        setError(`API item "${itemName}" not found.`);
      }
    } else {
      setApiItemData(null);
      setError("No API item specified in the URL.");
    }
  }, [itemName]);

  const isApiItemKnown = (typeName: string): boolean => {
    return !!MOCK_API_DATA[typeName];
  };

  // Placeholder simple header
  const PageHeader = () => (
    <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-slate-300 transition-colors">Angular Animations API Docs</Link>
        {/* Minimal search placeholder, actual search is on Homepage/ApiListingPage */}
        <div className="text-sm text-slate-400">Viewing API Details</div>
      </div>
    </header>
  );

  // Placeholder simple sidebar
  const DocumentationSidebar = () => (
    <aside className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 hidden md:block bg-white dark:bg-gray-900/50 h-full sticky top-16 self-start"> {/* top-16 assuming header height */}
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">API Categories</h2>
      <nav>
        <ul className="space-y-1.5">
          <li><Link to="/api-listing?category=Class" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Classes</Link></li>
          <li><Link to="/api-listing?category=Interface" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Interfaces</Link></li>
          <li><Link to="/api-listing?category=Function" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Functions</Link></li>
          <li><Link to="/api-listing?category=TypeAlias" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Type Aliases</Link></li>
          <li><Link to="/api-listing?category=Enum" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Enums</Link></li>
        </ul>
      </nav>
      {apiItemData && apiItemData.kind === 'Class' && (apiItemData.properties?.length || apiItemData.methods?.length) && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-200">Quick Nav ({apiItemData.name})</h3>
          <ul className="space-y-1 text-xs">
            {apiItemData.properties && apiItemData.properties.length > 0 && (
              <li><a href="#properties" className="text-gray-600 dark:text-gray-400 hover:underline">Properties</a></li>
            )}
            {apiItemData.methods && apiItemData.methods.length > 0 && (
              <li><a href="#methods" className="text-gray-600 dark:text-gray-400 hover:underline">Methods</a></li>
            )}
          </ul>
        </div>
      )}
    </aside>
  );
  
  // Placeholder simple footer
  const PageFooter = () => (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center p-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} Angular Animations API Documentation. Generated by mlo.</p>
    </footer>
  );


  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <PageHeader />
        <div className="flex-grow container mx-auto p-6 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">Error</h1>
            <p className="text-gray-700 dark:text-gray-300">{error}</p>
            <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Homepage</Link>
          </div>
        </div>
        <PageFooter />
      </div>
    );
  }

  if (!apiItemData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <PageHeader />
        <div className="flex-grow container mx-auto p-6 flex items-center justify-center">
          <p className="text-gray-700 dark:text-gray-300">Loading API item details...</p>
        </div>
        <PageFooter />
      </div>
    );
  }
  
  // Determine default tab based on content
  let defaultTabValue = "overview";
  if (apiItemData.kind === 'Function') defaultTabValue = "signature";
  else if (apiItemData.properties && apiItemData.properties.length > 0) defaultTabValue = "properties";
  else if (apiItemData.methods && apiItemData.methods.length > 0) defaultTabValue = "methods";


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <PageHeader />
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full"> {/* Container for sidebar + content */}
        <DocumentationSidebar />
        <ScrollArea className="flex-1 p-6 md:p-8">
          <main>
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {/* Assuming ApiListingPage can filter by kind */}
                  <BreadcrumbLink asChild><Link to={`/api-listing?category=${apiItemData.kind}`}>{apiItemData.kind}s</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{apiItemData.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <header className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50">{apiItemData.name}</h1>
                <Badge variant="secondary" className="text-sm capitalize">{apiItemData.kind}</Badge>
              </div>
              {apiItemData.docSummary && <p className="text-lg text-gray-600 dark:text-gray-400">{apiItemData.docSummary}</p>}
            </header>

            <Tabs defaultValue={defaultTabValue} className="w-full">
              <TabsList className="mb-4 border-b border-gray-200 dark:border-gray-700 rounded-none p-0 bg-transparent">
                <TabsTrigger value="overview" className="pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">Overview</TabsTrigger>
                {apiItemData.kind === 'Function' && (
                  <TabsTrigger value="signature" className="pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">Signature</TabsTrigger>
                )}
                {apiItemData.properties && apiItemData.properties.length > 0 && (
                  <TabsTrigger value="properties" id="properties" className="pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">Properties</TabsTrigger>
                )}
                {apiItemData.methods && apiItemData.methods.length > 0 && (
                  <TabsTrigger value="methods" id="methods" className="pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">Methods</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="prose prose-slate dark:prose-invert max-w-none">
                <p>{apiItemData.description}</p>
                
                {(apiItemData.extends || (apiItemData.implements && apiItemData.implements.length > 0)) && (
                  <Accordion type="single" collapsible className="w-full my-6">
                    <AccordionItem value="inheritance">
                      <AccordionTrigger className="text-lg font-semibold">Inheritance & Implementations</AccordionTrigger>
                      <AccordionContent className="text-base">
                        {apiItemData.extends && (
                          <p>Extends: <TypeDefinitionLink typeName={apiItemData.extends} isApiItem={isApiItemKnown(apiItemData.extends)} /></p>
                        )}
                        {apiItemData.implements && apiItemData.implements.length > 0 && (
                          <div>
                            Implements:
                            <ul className="list-disc pl-5">
                              {apiItemData.implements.map(impl => (
                                <li key={impl}><TypeDefinitionLink typeName={impl} isApiItem={isApiItemKnown(impl)} /></li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {apiItemData.exampleCode && (
                  <>
                    <h2 className="text-2xl font-semibold mt-6 mb-2">Example</h2>
                    <SyntaxHighlightedCodeBlock codeString={apiItemData.exampleCode} language="typescript" />
                  </>
                )}
              </TabsContent>

              {apiItemData.kind === 'Function' && (
                 <TabsContent value="signature">
                    <h2 className="text-2xl font-semibold mb-4">Function Signature</h2>
                     <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-md overflow-x-auto shadow-sm">
                      <code className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{apiItemData.name}</span>
                        (
                        {apiItemData.parameters?.map((param, index) => (
                          <React.Fragment key={`${param.name}-${index}`}>
                            <span className="text-slate-600 dark:text-slate-400">{param.name}</span>
                            {param.isOptional && <span className="text-yellow-600 dark:text-yellow-400">?</span>}
                            <span className="text-gray-500 dark:text-gray-400">: </span>
                            <TypeDefinitionLink typeName={param.type} isApiItem={isApiItemKnown(param.type)} />
                            {index < (apiItemData.parameters?.length ?? 0) - 1 && <span className="text-gray-500 dark:text-gray-400">, </span>}
                          </React.Fragment>
                        ))}
                        )
                        <span className="text-gray-500 dark:text-gray-400">: </span>
                        {apiItemData.returnType ? (
                          <TypeDefinitionLink typeName={apiItemData.returnType} isApiItem={isApiItemKnown(apiItemData.returnType)} />
                        ) : (
                          <span className="text-blue-500 dark:text-blue-400">void</span>
                        )}
                      </code>
                    </div>
                    {apiItemData.parameters && apiItemData.parameters.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Parameters</h3>
                          <ul className="space-y-3 pl-1">
                            {apiItemData.parameters.map((param) => (
                              <li key={param.name} className="text-sm p-3 bg-white dark:bg-gray-800/30 rounded-md border border-gray-200 dark:border-gray-700">
                                <div>
                                  <code className="font-semibold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-1 rounded text-base">{param.name}</code>
                                  {param.isOptional && <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>}
                                  <span className="text-gray-500 dark:text-gray-400 mx-1">:</span>
                                  <TypeDefinitionLink typeName={param.type} isApiItem={isApiItemKnown(param.type)} />
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
                 </TabsContent>
              )}

              {apiItemData.properties && apiItemData.properties.length > 0 && (
                <TabsContent value="properties">
                  <h2 className="text-2xl font-semibold mb-4">Properties</h2>
                  <div className="space-y-4">
                    {apiItemData.properties.map(prop => (
                      <ApiMemberDetailItem
                        key={prop.name}
                        kind="property"
                        name={prop.name}
                        description={prop.description}
                        propertyType={prop.propertyType}
                      />
                    ))}
                  </div>
                </TabsContent>
              )}

              {apiItemData.methods && apiItemData.methods.length > 0 && (
                <TabsContent value="methods">
                  <h2 className="text-2xl font-semibold mb-4">Methods</h2>
                  <div className="space-y-4">
                    {apiItemData.methods.map(method => (
                      <ApiMemberDetailItem
                        key={method.name}
                        kind="method"
                        name={method.name}
                        description={method.description}
                        parameters={method.parameters}
                        returnType={method.returnType}
                      />
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </main>
        </ScrollArea>
      </div>
      <PageFooter />
    </div>
  );
};

export default ApiItemDetailPage;