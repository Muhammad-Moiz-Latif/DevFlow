import { create } from 'zustand';

type WorkspaceState = {
    _id: string,
    slug: string
};

type WorkspaceStore = {
    workspace: WorkspaceState | null,
    setWorkspace: (workspace: WorkspaceState) => void,
    clearWorkspace: () => void
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
    workspace: null,
    setWorkspace: (workspace) => set({ workspace }),
    clearWorkspace: () => set({ workspace: null })
}));