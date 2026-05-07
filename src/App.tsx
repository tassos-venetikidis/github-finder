import UserSearch from "./components/UserSearch.tsx";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="container">
      <h1>GitHub Finder</h1>
      <UserSearch></UserSearch>
      <Toaster></Toaster>
    </div>
  );
}

export default App;
