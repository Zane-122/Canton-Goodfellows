
interface TagProps {
    backgroundColor: string;
    text: string;
}

export const Tag: React.FC<TagProps> = ({ backgroundColor, text }) => {
    return <div style={{
        backgroundColor: backgroundColor || "black",
        color: 'white',
        padding: '0.5vmin 1vmin',
        borderRadius: '1vmin',
        fontSize: '1.5vmin',
        fontFamily: 'TT Trick New, serif',
        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
    }}>
        <span style={{
            justifyContent: 'center',
            alignItems: 'center',
            verticalAlign: 'middle',
        }}>
            {text}
        </span>
    </div>;
}