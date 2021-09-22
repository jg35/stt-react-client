import Image from "~/components/image";
import { Paper } from "~/components/_styled";
import { coverImages } from "~/lib/imageSizes";

export default function BookCover({ coverUrl }) {
  return (
    <div className="lg:max-w-none mx-auto">
      <Paper pages={2} pageWidth={0.75}>
        <Image
          src={coverUrl + coverImages["1200px"]}
          style={{ minWidth: "150px" }}
        />
      </Paper>
    </div>
  );
}
