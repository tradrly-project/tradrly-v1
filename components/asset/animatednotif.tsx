import { motion } from "framer-motion";

export function AnimatedCheckStroke({ size = 24, color = "#0EA5E9", delay = 0.5 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      animate="visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M5 13L9 17L19 7"
        variants={{
          hidden: { pathLength: 0 },
          visible: {
            pathLength: 1,
            transition: {
              duration: 0.6,
              delay,
              ease: "easeInOut",
            },
          },
        }}
      />
    </motion.svg>
  );
}


export function AnimatedXStroke({ size = 24, color = "#EF4444", delay = 0.5 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
    >
      <motion.line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        variants={{
          hidden: { pathLength: 0 },
          visible: {
            pathLength: 1,
            transition: {
              duration: 0.3,
              delay: delay,
              ease: "easeInOut",
            },
          },
        }}
      />
      <motion.line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
        variants={{
          hidden: { pathLength: 0 },
          visible: {
            pathLength: 1,
            transition: {
              duration: 0.3,
              delay: delay + 0.3, // muncul setelah garis pertama selesai
              ease: "easeInOut",
            },
          },
        }}
      />
    </motion.svg>
  );
}