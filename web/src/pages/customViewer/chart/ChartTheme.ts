import { useMemo } from "react";

export const LIGHT_PALETTE = [
    '#6366f1', '#f59e0b', '#10b981', '#ef4444',
    '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316',
];

export const DARK_PALETTE = [
    '#818cf8', '#fcd34d', '#34d399', '#f87171',
    '#60a5fa', '#f472b6', '#a78bfa', '#2dd4bf', '#fb923c',
];

const COMPLETION_PALETTE = [
    '#22c55e', '#f59e0b', '#3b82f6', '#6b7280',
];

const APPROVAL_PALETTE = [
    '#22c55e', '#f59e0b', '#3b82f6', '#6b7280',
];


export function useCommonChartStyles() {
    const commonOptions = useMemo(() => ({

        colors: LIGHT_PALETTE,
        approvalColors: APPROVAL_PALETTE,

        completionColor: {
            colors: COMPLETION_PALETTE
        },

        title: {
            style: {
                fontSize: '16px',
                fontWeight: '700',
                fontFamily: "'DM Sans', sans-serif",
                color: '#111827',
            },
        },

        subtitle: {
            style: {
                fontSize: '12px',
                fontWeight: '400',
                fontFamily: "'DM Sans', sans-serif",
                color: '#9ca3af',
            },
        },

        barStyle: {
            borderRadius: 6,
            borderRadiusApplication: 'end',
            columnWidth: '52%',
            distributed: true,
        }

    }), []);

    return { commonOptions };
}
