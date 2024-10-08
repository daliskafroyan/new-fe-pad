import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface UpdatePasswordCardProps {
    onSubmit: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

export const UpdatePasswordCard: React.FC<UpdatePasswordCardProps> = ({ onSubmit }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(oldPassword, newPassword, confirmPassword);
    };

    return (
        <Card className="w-full">
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
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
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
            await axios.put('/users/detail-users/update-password', {
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

        <UpdatePasswordCard onSubmit={handlePasswordUpdate} />

    );
};

export default UpdatePasswordPage;
