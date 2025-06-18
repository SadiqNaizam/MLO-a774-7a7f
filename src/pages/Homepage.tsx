import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import ApiItemSummaryCard from '@/components/ApiItemSummaryCard'; // Custom component
import { Search, BookOpen, Code, Terminal, Layers, Type, Compass, Github } from 'lucide-react';

const Homepage = () => {
  console.log('Homepage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/api-listing?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/api-listing'); // Navigate to base listing if search is empty
    }
  };

  const categoryCards = [
    { title: 'Classes', description: 'Explore all class definitions.', link: '/api-listing?category=classes', icon: <Terminal className="h-8 w-8 mb-2 text-blue-500" /> },
    { title: 'Interfaces', description: 'Discover available interfaces.', link: '/api-listing?category=interfaces', icon: <Layers className="h-8 w-8 mb-2 text-green-500" /> },
    { title: 'Functions', description: 'Browse through utility functions.', link: '/api-listing?category=functions', icon: <Code className="h-8 w-8 mb-2 text-purple-500" /> },
    { title: 'Enums & Types', description: 'Understand enums and type aliases.', link: '/api-listing?category=enums-types', icon: <Type className="h-8 w-8 mb-2 text-red-500" /> },
  ];

  const featuredApiItems = [
    { name: 'AnimationDriver', kind: 'Class', summary: 'Provides an abstract instrument for animating DOM elements.', itemName: 'AnimationDriver', itemKind: 'class' },
    { name: 'animate', kind: 'Function', summary: 'A function to trigger an animation sequence.', itemName: 'animate', itemKind: 'function' },
    { name: 'AnimationPlayer', kind: 'Interface', summary: 'Controls an animation, allowing for play, pause, and finish.', itemName: 'AnimationPlayer', itemKind: 'interface' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-800 text-slate-900 dark:text-slate-50">
      {/* PageHeader Section */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-slate-900/95 dark:border-slate-700/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-7 w-7 text-sky-600 dark:text-sky-400" />
            <span className="font-bold text-xl text-slate-800 dark:text-slate-200">Angular Animations API</span>
          </Link>
          <div className="w-full max-w-md">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search API (e.g., AnimationDriver)..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-300 dark:border-slate-700 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500 dark:bg-slate-800 dark:text-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search Angular Animations API"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <Button type="submit" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 hidden sm:inline-flex hover:bg-slate-200 dark:hover:bg-slate-700">
                Search
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero/Introduction Section */}
        <section className="py-16 md:py-24 bg-slate-100 dark:bg-slate-800/30 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Compass className="h-16 w-16 mx-auto mb-6 text-sky-500" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
              Angular Animations API
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10">
              Explore the comprehensive documentation for the Angular Animations API. Find detailed information on classes, interfaces, functions, and types to build powerful animations in your Angular applications.
            </p>
            <Button size="lg" asChild className="bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600">
              <Link to="/api-listing">Explore All API Items</Link>
            </Button>
          </div>
        </section>

        {/* API Categories Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
              Explore API Categories
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              Dive into specific parts of the API to find exactly what you need.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {categoryCards.map((category) => (
                <Card key={category.title} className="text-center transform transition-all hover:scale-105 hover:shadow-xl dark:bg-slate-800 dark:border-slate-700">
                  <Link to={category.link} className="block p-6 h-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-lg">
                    <CardHeader className="items-center p-0 mb-3">
                      {category.icon}
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured API Items Section */}
        <section className="py-12 md:py-20 bg-slate-100 dark:bg-slate-800/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                    Featured API Items
                </h2>
                <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                    Get a quick look at some of the core components of the Angular Animations API.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {featuredApiItems.map((item) => (
                        <ApiItemSummaryCard
                            key={item.itemName}
                            name={item.name}
                            kind={item.kind}
                            summary={item.summary}
                            itemName={item.itemName}
                            itemKind={item.itemKind}
                        />
                    ))}
                </div>
            </div>
        </section>
      </main>

      {/* PageFooter Section */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <a href="https://github.com/angular/angular" target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              <Github className="h-6 w-6" />
              <span className="sr-only">Angular GitHub</span>
            </a>
             <a href="https://angular.io/docs" target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-sm">
              Angular Official Docs
            </a>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Angular Animations API Explorer.
            This is a fictional documentation browser for demonstration.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;