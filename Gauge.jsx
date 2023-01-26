import React from "react"

const Gauge = ({
  value=50,
  min=0,
  max=100,
  label,
  units,
}) => {
  return (
    <View>
      <svg
        width="9em"
        style={{
          border: "1px solid pink"
        }}>
      </svg>
    </View>
  )
}

export default Gauge