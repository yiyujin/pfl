export default function Gallery() {
  const images = [

    "/pfl1.jpg",
    "/pfl2.jpg",
    "/pfl3.jpg",
    "/pfl4.jpg",
    "/pfl5.jpg",
    "/pfl6.jpg",
    "/pfl7.jpg",
    "/pfl8.jpg",
    "/pfl9.jpg",
    "/pfl10.jpg",
    "/pfl11.jpg",
    "/pfl12.jpg",
    "/pfl13.jpg",
    "/pfl14.jpg",
    "/pfl15.jpg",
    "/pfl16.jpg",
  ];

  return (
    <div className = "page">
      <h1>Gallery</h1>

      <img src='https://file.notion.so/f/f/e03c720f-f008-4075-a4d9-2cd311c55b1d/de3b2878-0da5-4136-870d-bf4e9dc3b5e5/pfl1.jpg?table=block&id=25aafaf7-b684-8033-b94d-f4fa6c7b46df&spaceId=e03c720f-f008-4075-a4d9-2cd311c55b1d&expirationTimestamp=1756180800000&signature=Mw19bcHv-F5WO0whDd_yO8ip_CSrDzNgPKSK6D2rG8M&downloadName=pfl1.jpg' />

      <div className = "gallery">
        { images.map( ( src, idx ) => (
          <img key ={ idx } src = { src } alt = { `Image ${idx}` } />
        ))}
      </div>
    </div>
  );
}
