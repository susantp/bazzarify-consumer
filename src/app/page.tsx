// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function Page() {
  return (
    <div className="flex flex-row items-center justify-center w-full h-screen bg-primary">
      <h1 className="text-primary-foreground text-4xl ">Under Construction</h1>
    </div>
  );
}
