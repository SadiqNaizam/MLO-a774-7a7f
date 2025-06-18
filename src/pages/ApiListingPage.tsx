import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Custom Components
import ApiItemSummaryCard from '@/components/ApiItemSummaryCard';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For sidebar structure
import { ScrollArea } from '@/components/ui/scroll-area';

// Lucide Icons
import { Search, Filter, ListFilter, SlidersHorizontal } from 'lucide-react';

// Placeholder data for API items
const allApiItems = [
  { name: 'AnimationBuilder', kind: 'Class', summary: 'A builder for creating reusable animations.', itemName: 'AnimationBuilder', itemKind: 'class' },
  { name: 'AnimationDriver', kind: 'Class', summary: 'Provides an abstract instrument for controlling animations.', itemName: 'AnimationDriver', itemKind: 'class' },
  { name: 'AnimationEngine', kind: 'Class', summary: 'A class that an AnimationDriver uses to actually animate elements.', itemName: 'AnimationEngine', itemKind: 'class' },
  { name: 'AnimationFactory', kind: 'Interface', summary: 'An interface for animation factories.', itemName: 'AnimationFactory', itemKind: 'interface' },
  { name: 'AnimationMetadata', kind: 'Interface', summary: 'Represents animation metadata.', itemName: 'AnimationMetadata', itemKind: 'interface' },
  { name: 'AnimationPlayer', kind: 'Interface', summary: 'Provides animation playback controls.', itemName: 'AnimationPlayer', itemKind: 'interface' },
  { name: 'animate', kind: 'Function', summary: 'Specifies an animation step that applies given style data to the parent animation for a given period of time.', itemName: 'animate', itemKind: 'function' },
  { name: 'group', kind: 'Function', summary: 'Specifies a list of animation steps that are all run in parallel.', itemName: 'group', itemKind: 'function' },
  { name: 'keyframes', kind: 'Function', summary: 'Specifies a collection of animation steps, each containing a set of styles and an offset.', itemName: 'keyframes', itemKind: 'function' },
  { name: 'AnimationTriggerMetadata', kind: 'Type Alias', summary: 'Metadata representing the entry of animations. Instances of this interface are provided via the animation DSL when the trigger animation function is called.', itemName: 'AnimationTriggerMetadata', itemKind: 'type' },
  { name: 'AnimationStyleMetadata', kind: 'Interface', summary: 'Encapsulates an animation style. Instances of this interface are provided via the animation DSL when the style animation function is called.', itemName: 'AnimationStyleMetadata', itemKind: 'interface' },
  { name: 'NoopAnimationDriver', kind: 'Class', summary: 'An animation driver that does nothing. Provides a pluggability point for environments without animation support.', itemName: 'NoopAnimationDriver', itemKind: 'class' },
];

const API_KINDS = ['All', 'Class', 'Interface', 'Function', 'Enum', 'Type Alias', 'Const'];

const ITEMS_PER_PAGE = 6;

const ApiListingPage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKind, setSelectedKind] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState(allApiItems);

  useEffect(() => {
    console.log('ApiListingPage loaded');
    // Parse query params from URL (e.g., from sidebar clicks or initial search)
    const queryParams = new URLSearchParams(location.search);
    const querySearch = queryParams.get('q') || '';
    const queryKind = queryParams.get('kind') || 'All';

    setSearchTerm(querySearch);
    setSelectedKind(API_KINDS.includes(queryKind) ? queryKind : 'All');
  }, [location.search]);

  useEffect(() => {
    let items = allApiItems;
    if (searchTerm) {
      items = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedKind !== 'All') {
      items = items.filter(item => item.kind.toLowerCase() === selectedKind.toLowerCase());
    }
    setFilteredItems(items);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, selectedKind]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKindChange = (value: string) => {
    setSelectedKind(value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // PageHeader placeholder
  const PageHeader = () => (
    <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-xl font-bold hover:text-slate-300">Angular Animations API Docs</Link>
      {/* Global search could be here, but for this page, filters are below */}
    </header>
  );

  // DocumentationSidebar placeholder
  const DocumentationSidebar = () => (
    <aside className="w-64 bg-slate-50 dark:bg-slate-800 p-4 border-r border-slate-200 dark:border-slate-700">
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center">
            <ListFilter className="h-4 w-4 mr-2" /> API Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <nav className="flex flex-col space-y-1">
            {API_KINDS.map((kind) => (
              <Button
                key={kind}
                variant={selectedKind === kind ? 'secondary' : 'ghost'}
                className="w-full justify-start px-2 dark:text-slate-300 dark:hover:bg-slate-700"
                onClick={() => handleKindChange(kind)}
                asChild={kind !== selectedKind} // Use Link only if not active to avoid re-rendering via query params
              >
                {kind !== selectedKind ? (
                    <Link to={`/api-listing?kind=${kind.toLowerCase().replace(' ', '-')}${searchTerm ? `&q=${encodeURIComponent(searchTerm)}`: ''}`}>
                        {kind}
                    </Link>
                ) : (
                    <span>{kind}</span>
                )}
              </Button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );

  // PageFooter placeholder
  const PageFooter = () => (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-center p-4 text-sm text-slate-600 dark:text-slate-400">
      &copy; {new Date().getFullYear()} Angular Animations API Documentation.
    </footer>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <PageHeader />
      <div className="flex flex-1 overflow-hidden">
        <DocumentationSidebar />
        <ScrollArea className="flex-1">
          <main className="p-6">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {searchTerm ? `Search: "${searchTerm}"` : 'API Listing'}
                    {selectedKind !== 'All' && ` (${selectedKind})`}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <section aria-labelledby="filter-heading" className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
              <h2 id="filter-heading" className="text-lg font-semibold mb-4 flex items-center"><SlidersHorizontal className="mr-2 h-5 w-5 text-primary"/>Filter API Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label htmlFor="search-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Search by Name
                  </label>
                  <div className="relative">
                    <Input
                      id="search-input"
                      type="text"
                      placeholder="e.g., AnimationDriver, animate"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="kind-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Filter by Kind
                  </label>
                  <Select value={selectedKind} onValueChange={handleKindChange}>
                    <SelectTrigger id="kind-select" className="w-full">
                      <SelectValue placeholder="Select API kind" />
                    </SelectTrigger>
                    <SelectContent>
                      {API_KINDS.map((kind) => (
                        <SelectItem key={kind} value={kind}>
                          {kind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* A dedicated "Apply Filters" button might be useful if operations are expensive, 
                    but for now, filtering is reactive */}
              </div>
            </section>

            {paginatedItems.length > 0 ? (
              <section aria-labelledby="api-items-heading">
                <h2 id="api-items-heading" className="sr-only">API Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedItems.map((item) => (
                    <ApiItemSummaryCard
                      key={item.itemName + item.kind}
                      name={item.name}
                      kind={item.kind}
                      summary={item.summary}
                      itemName={item.itemName}
                      itemKind={item.itemKind}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <div className="text-center py-10">
                <Filter className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">No API items found.</p>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                     // Basic pagination, ideally use ellipsis for many pages
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {/* <PaginationItem><PaginationEllipsis /></PaginationItem> */}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </main>
        </ScrollArea>
      </div>
      <PageFooter />
    </div>
  );
};

export default ApiListingPage;