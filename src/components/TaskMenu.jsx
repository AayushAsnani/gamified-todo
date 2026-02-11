import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TaskMenu({ taskId, onReschedule, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen]);

    const handleReschedule = () => {
        setIsOpen(false);
        onReschedule(taskId);
    };

    const handleDelete = () => {
        setIsOpen(false);
        onDelete(taskId);
    };

    return (
        <div className="task-menu" ref={menuRef}>
            <button
                type="button"
                className="task-menu-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Task options"
                aria-expanded={isOpen}
            >
                ⋮
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="task-menu-dropdown"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        <button
                            type="button"
                            className="task-menu-item"
                            onClick={handleReschedule}
                        >
                            <span className="task-menu-icon">📅</span>
                            Reschedule
                        </button>
                        <button
                            type="button"
                            className="task-menu-item task-menu-item-danger"
                            onClick={handleDelete}
                        >
                            <span className="task-menu-icon">🗑️</span>
                            Delete
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default TaskMenu;
