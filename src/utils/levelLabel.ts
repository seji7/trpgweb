export function getLevelLabel(level: number): string {
    switch (level) {
        case 1: return "스페셜";
        case 2: return "VIP";
        default: return "일반";
    }
}