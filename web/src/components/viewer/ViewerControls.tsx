import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { MdRotateRight } from 'react-icons/md';

/**
 * Shared zoom / rotate / reset state for document viewers.
 * The returned `style` is a purely visual CSS transform, so it does not change
 * any underlying canvas coordinate space (stamp math stays intact).
 */
export const useViewerTransform = (initialScale = 1) => {
    const [scale, setScale] = useState(initialScale);
    const [rotation, setRotation] = useState(0);

    const zoomIn = () => setScale((s) => Math.min(+(s + 0.15).toFixed(2), 4));
    const zoomOut = () => setScale((s) => Math.max(+(s - 0.15).toFixed(2), 0.25));
    const rotate = () => setRotation((r) => (r + 90) % 360);
    const reset = () => {
        setScale(initialScale);
        setRotation(0);
    };

    const style: CSSProperties = {
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        transition: 'transform 0.2s ease',
    };

    return { scale, rotation, zoomIn, zoomOut, rotate, reset, style };
};

interface Props {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onRotate: () => void;
    onReset: () => void;
    className?: string;
}

const btn =
    'cursor-pointer p-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ' +
    'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

const resetBtn =
    'cursor-pointer px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ' +
    'text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

/** Compact toolbar: zoom out / zoom in / rotate / reset. */
export const ViewerControls = ({ onZoomIn, onZoomOut, onRotate, onReset, className }: Props) => (
    <div className={`flex items-center gap-2 ${className || ''}`}>
        <button type="button" onClick={onZoomOut} title="Zoom out" className={btn}>
            <AiOutlineZoomOut fontSize={18} />
        </button>
        <button type="button" onClick={onZoomIn} title="Zoom in" className={btn}>
            <AiOutlineZoomIn fontSize={18} />
        </button>
        <button type="button" onClick={onRotate} title="Rotate" className={btn}>
            <MdRotateRight fontSize={18} />
        </button>
        <button type="button" onClick={onReset} title="Reset" className={resetBtn}>
            Reset
        </button>
    </div>
);
