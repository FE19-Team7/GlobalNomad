'use client'

import SideMenu from "@/src/components/SideMenu/SideMenu";

export default function MyPage() {
  return (
    <div>
      <aside>
        <SideMenu 
          className="w-[290px]"
          profileImageUrl={null}
          onProfileEdit={()=>{
            console.log("프로필 편집");
          }}/>
      </aside>
    </div>
  );
}