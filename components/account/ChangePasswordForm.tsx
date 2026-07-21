'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Key, Eye, EyeOff, RefreshCcw } from 'lucide-react';

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { changePassword } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast('New password must be at least 6 characters long.', 'error');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast('New passwords do not match.', 'error');
            return;
        }

        setLoading(true);

        try {
            await changePassword(currentPassword, newPassword, revokeOtherSessions);
            toast('Password changed successfully.', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setRevokeOtherSessions(false);
        } catch (err: any) {
            toast(err.message || 'Failed to change password.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div>
                <label htmlFor="currentPassword" className="block text-[13px] font-semibold text-[#111111] mb-2">
                    Current Password
                </label>
                <div className="relative">
                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/30" />
                    <input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-full border border-black/[0.08] bg-[#f9f9f9] pl-11 pr-12 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10"
                        placeholder="Current password"
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111111]/30 hover:text-[#111111]/60 transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="newPassword" className="block text-[13px] font-semibold text-[#111111] mb-2">
                    New Password
                </label>
                <div className="relative">
                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/30" />
                    <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-full border border-black/[0.08] bg-[#f9f9f9] pl-11 pr-12 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10"
                        placeholder="Min 6 characters"
                        autoComplete="new-password"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="confirmNewPassword" className="block text-[13px] font-semibold text-[#111111] mb-2">
                    Confirm New Password
                </label>
                <div className="relative">
                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/30" />
                    <input
                        id="confirmNewPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full rounded-full border border-black/[0.08] bg-[#f9f9f9] pl-11 pr-4 py-3 text-sm text-[#111111] outline-none transition-all duration-300 focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10"
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <input
                    id="revokeOtherSessions"
                    type="checkbox"
                    checked={revokeOtherSessions}
                    onChange={(e) => setRevokeOtherSessions(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#b76e79] focus:ring-[#b76e79]"
                />
                <label htmlFor="revokeOtherSessions" className="text-sm text-luxury-gray cursor-pointer select-none">
                    Log out of other devices
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#111111]/90 disabled:opacity-50"
            >
                {loading ? (
                    <RefreshCcw className="animate-spin" size={16} />
                ) : (
                    'Update Password'
                )}
            </button>
        </form>
    );
}
