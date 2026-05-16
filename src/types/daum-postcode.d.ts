// `@actbase/react-daum-postcode` 패키지가 exports 필드를 노출하지 않아
// moduleResolution: "bundler" 환경에서 서브경로 타입을 해석하지 못한다.
// 코드에서 실제로 쓰는 필드만 ambient 로 선언해 빌드를 통과시킨다.
declare module '@actbase/react-daum-postcode/lib/types' {
  export interface OnCompleteParams {
    zonecode: number;
    address: string;
    addressEnglish: string;
    addressType: 'R' | 'J';
    userSelectedType: 'R' | 'J';
    noSelected: 'Y' | 'N';
    userLanguageType: 'K' | 'E';
    roadAddress: string;
    roadAddressEnglish: string;
    jibunAddress: string;
    jibunAddressEnglish: string;
    autoRoadAddress: string;
    autoRoadAddressEnglish: string;
    autoJibunAddress: string;
    autoJibunAddressEnglish: string;
    buildingCode: string;
    buildingName: string;
    apartment: 'Y' | 'N';
    sido: string;
    sigungu: string;
    sigunguCode: string;
    roadnameCode: string;
    bcode: string;
    roadname: string;
    bname: string;
    bname1: string;
    bname2: string;
    hname: string;
    query: string;
  }
}
