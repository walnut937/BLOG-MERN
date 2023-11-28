import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
function Pageanimation({ children, keyvalue, initial = { opacity : 0 }, animate = { opacity : 1 }, transition ={ duration: 1 } }) {
  return (
    <>
    <AnimatePresence>
      <motion.div
        key={keyvalue}
        initial = { initial }
        animate = { animate }
        transition={ transition }
      >
        { children }
      </motion.div>
    </AnimatePresence>
    </>
  )
}

export default Pageanimation