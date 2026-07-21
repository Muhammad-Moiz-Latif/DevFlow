import { useParams } from "react-router"
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useWorkspaceMembers } from "../query/useWorkspaceMembers";
import { MemberDetailRow } from "./memberRow";
import { Users2, Plus } from "lucide-react";

export const WorkspaceMembers = () => {
    const { workspaceSlug } = useParams();
    const { data: currentWorkspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: MembersData, isPending } = useWorkspaceMembers(currentWorkspaceData?.data?.id!);



    if (isPending) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <h1>Loading members...</h1>
            </div>
        )
    };

    const activeMembers = MembersData?.data!.filter((member) => member.status === 'SUCCESS').length;
    const pendingMembers = MembersData?.data!.filter((member) => member.status === 'PENDING').length;


    return (
        <div className="px-6 py-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <Users2 className="size-4" />
                            <span>People</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Members</h1>
                            <p className="mt-3 text-sm text-muted-foreground">
                                {activeMembers} active · {pendingMembers} pending
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="flex items-center gap-3 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.72_0.18_280/0.65)] transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                        <Plus className="size-5" strokeWidth={2.25} />
                        Invite member
                    </button>
                </div>


            </div>

            <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface/80 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.75)] backdrop-blur">
                <div className="grid grid-cols-[minmax(0,1fr)_140px_193px_48px] border-b border-border/80 px-6 py-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Name</span>
                    <span className="text-center">Role</span>
                    <span className="text-center">Joined</span>
                    <span />
                </div>

                <div className="divide-y divide-border/80">
                    {MembersData?.data?.map((member) => (
                        <MemberDetailRow key={member.id} data={member} />
                    ))}
                </div>
            </div>
        </div>
    )
}