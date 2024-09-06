import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface UpdatePasswordCardProps {
    onSubmit: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

export const UpdatePasswordCard: React.FC<UpdatePasswordCardProps> = ({ onSubmit }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(oldPassword, newPassword, confirmPassword);
    };

    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>Update Password</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="oldPassword">Password Lama</Label>
                        <Input
                            id="oldPassword"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Password Baru</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex justify-end'>
                        <Button type="submit" className='mt-4'>Update Password</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

const UpdatePasswordPage = () => {
    const { toast } = useToast();

    const handlePasswordUpdate = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        if (newPassword !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'New password and confirmation do not match',
                variant: 'destructive',
            });
            return;
        }

        try {
            await axios.post('/users/update/password', {
                passwordLama: oldPassword,
                konfirmasiPassword: confirmPassword,
                passwordBaru: newPassword,
            });

            toast({
                title: 'Success',
                description: 'Password updated successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update password',
                variant: 'destructive',
            });
        }
    };

    return (
        <Layout>
            <Layout.Header sticky>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body>
                <UpdatePasswordCard onSubmit={handlePasswordUpdate} />
            </Layout.Body>
        </Layout>
    );
};

export default UpdatePasswordPage;
