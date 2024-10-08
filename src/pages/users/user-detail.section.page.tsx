import api from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { RoleData } from "./list-roles.page";

interface UserDetail {
    id: string;
    email: string;
    client_id: string;
    status: boolean;
    next_login: number;
    is_verifikasi: boolean;
    id_roles: number;
    is_update_password: boolean;
}

interface UserDetailResponse {
    message: string;
    code: number;
    status: boolean;
    data: UserDetail;
    roles:string;
}


const UserProfileCard = () => {
    const userDetailQuery = useQuery<UserDetailResponse>({
        queryKey: ['user-detail'],
        queryFn: async () => {
            try {
                const response = await api.get("/users/detail-users");
                return response.data;
            } catch (error) {
                toast({
                    title: "Error",
                    description: `Failed to fetch user details: ${(error as Error).message}`,
                    variant: "destructive",
                });
                throw error;
            }
        },
    });

    const userDetail = userDetailQuery.data?.data;
    const namaRoles = userDetailQuery.data?.roles;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <strong className="mb-1 sm:mb-0">Email:</strong>
                        <span className="break-all">{userDetail?.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <strong className="mb-1 sm:mb-0">Status:</strong>
                        <span>{userDetail?.status ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <strong className="mb-1 sm:mb-0">Verified:</strong>
                        <span>{userDetail?.is_verifikasi ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <strong className="mb-1 sm:mb-0">Role:</strong>
                        <span>{namaRoles}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserProfileCard;