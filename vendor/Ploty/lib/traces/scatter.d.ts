import { Color } from '../../index.d.ts';

export interface ScatterSelectedMarker {
    marker: Partial<{
        opacity: number;
        color: Color;
    }>;
    textfont: { color: Color };
}
