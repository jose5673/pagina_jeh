import React, { createContext, useState, useContext } from 'react';

const GroupsContext = createContext();

export const useGroups = () => {
  return useContext(GroupsContext);
};

export function GroupsProvider({ children }) {
  const [groups, setGroups] = useState([
    { id: 'g1', name: 'grupo caterpilar', refNumber: '525' },
    { id: 'g2', name: 'grupo generador', refNumber: '700' },
  ]);

  const addGroup = (name, refNumber) => {
    const newId = `g-${Date.now()}`;
    const newGroup = { id: newId, name, refNumber };
    setGroups((prev) => [...prev, newGroup]);
  };

  const deleteGroup = (groupId) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  return (
    <GroupsContext.Provider value={{ groups, addGroup, deleteGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}