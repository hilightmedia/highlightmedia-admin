import { Search, FolderPlus } from "lucide-react";

import { useState } from "react";
import { Input } from "../../common/input";
import Button from "../../common/button";
import { FilterIconOutlined } from "../../common/icon";

const PlayerActions = () => {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
        <div className="relative flex-1 max-w-[600px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            // value={query}
            // onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="pl-10 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <select className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition">
          <option value="">Bulk Actions</option>
        </select>
        <Button className="primary px-6">Apply</Button>
      </div>
      <div className="flex gap-6 items-center">
        <Button className="button-gradient px-6" onClick={() => setCreateFolderOpen(true)}>
          <FolderPlus />
          Create Folder
        </Button>
        <select className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition">
          <option value="">All Status</option>
        </select>
        <select className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition">
          <option value="">Sort by default</option>
        </select>
        <Button className="primary px-6 flex gap-2 items-center">
          <FilterIconOutlined /> Filters
        </Button>
      </div>
      {/* <CreateFolder open={createFolderOpen} onClose={() => setCreateFolderOpen(false)} /> */}
    </>
  );
};

export default PlayerActions;
