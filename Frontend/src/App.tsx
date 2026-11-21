import React from "react";
import { Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import AddPeople from "./components/AddPeople";
import GetAllPeople from "./components/GetAllPeople";
import GetPeopleById from "./components/GetPeopleById";
import UpdatePeopleWithId from "./components/UpdatePeopleWithId";
import DeletePeopleById from "./components/DeletePeopleById";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/add" element={<AddPeople />} />
        <Route path="/getall" element={<GetAllPeople />} />
        <Route path="/getbyid" element={<GetPeopleById />} />
        <Route path="/update" element={<UpdatePeopleWithId />} />
        <Route path="/delete" element={<DeletePeopleById />} />
      </Routes>
    </>
  );
};

export default App;
