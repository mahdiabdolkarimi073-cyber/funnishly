import Image from "next/image";

type Props = Partial<{
    height : number
    width : number
}>

export default function Logo (props : Props = {height :  60 , width : 130}) {
    return (
        <Image width={130} height={60} src={"/images/logo/logo.png"} alt="LOGO - آرم" />
    )
}