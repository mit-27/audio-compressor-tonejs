import { useState } from "react";
import { Slider } from "./ui/slider"

interface Props {
    propertyName: string,
    value: number,
    onChange: (key: string, value: number) => void,
    disabled: boolean
}

const settingsConfig : Record<string, {min: number, max: number, step: number}> = {
    threshold: { min: -100, max: 0, step: 1},
    attack: { min: 0, max: 1, step: 0.01 },
    knee: { min: 0, max: 40, step: 1},
    ratio: { min: 1, max: 20, step: 0.1 },
    release: { min: 0, max: 1, step: 0.01}
  };


const CompressionPropertyHandler = ({propertyName, value, onChange, disabled}: Props) => {

    const [currentValue, setCurrentValue] = useState(value);

    const handleChange = (newValue: number[]) => {
        setCurrentValue(newValue[0]);
        onChange(propertyName, newValue[0]);
    };


  return (
    <div className="flex items-baseline">
        <p className="w-24 text-sm capitalize">{propertyName}</p>
        <p className="w-24 text-sm flex items-center justify-center">{value}</p>
        <Slider
        className="flex-grow"
        value={[currentValue]}
        min={settingsConfig[propertyName].min}
        max={settingsConfig[propertyName].max}
        step={settingsConfig[propertyName].step}
        onValueChange={handleChange}
        disabled={disabled}
        />

    </div>
  )
}

export default CompressionPropertyHandler