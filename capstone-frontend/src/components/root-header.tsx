import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';

export function RootHeader() {
  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b">
      <div className="mx-4 flex h-14 items-center space-x-2">
        <div className="grow space-x-2 [&>.active]:font-bold">
          <Link to="/">Home</Link>
          <Link to="/posts">Posts</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/login"> Log In</Link>
          <Button asChild>
            <Link to="/signup"> Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
