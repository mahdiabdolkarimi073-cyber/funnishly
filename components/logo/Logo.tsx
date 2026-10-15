import Image from "next/image";

type Props = Partial<{
    height: number;
    width: number;
}>

export default function Logo(props: Props = { height: 60, width: 130 }) {
    const width = props.width ?? 130;
    const height = props.height ?? 60;

    return (
        <Image
            width={width}
            height={height}
            src="/images/logo/logo.png"
            alt="لوگو فانیشلی"
        />
    );
}
