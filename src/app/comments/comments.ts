import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, CommentResponse } from '../services/api.service';
import { DashboardService } from '../services/dashboard.service';

interface Comment {
  id: number;
  username: string;
  comment: string;
  date: Date;
  replies: number;
}

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.html',
  styleUrls: ['./comments.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComentariosComponent implements OnInit {
  domainName = signal<string>('');
  comments = signal<Comment[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  activeMenu = signal<number | null>(null);

  // fullUrl que se enviará en el header 'Full-URL', e idWeb para inbox
  private fullUrl = '';
  private idWeb = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private dashboard: DashboardService
  ) {
    this.route.queryParams.subscribe(params => {
      // Buscar idWeb para bandeja del inbox
      const idWebParam = params['idWeb'] || params['idweb'];
      const fq = params['fullUrl'] || params['fullURL'] || params['fullurl'];
      const domain = params['domain'];

      if (idWebParam) {
        this.idWeb = idWebParam;
        this.fullUrl = '';
        this.domainName.set(domain || idWebParam);
      } else if (fq) {
        this.fullUrl = fq;
        this.idWeb = '';
        this.domainName.set(fq);
      } else if (domain) {
        // Fallback: si solo tenemos domain, construimos un fullUrl genérico
        const maybe = typeof domain === 'string' && domain.includes('youtube') ? domain : `https://www.youtube.com/watch?v=${domain}`;
        this.fullUrl = maybe;
        this.idWeb = '';
        this.domainName.set(maybe);
      } else {
        // Fallback final
        this.fullUrl = 'https://www.youtube.com/';
        this.idWeb = '';
        this.domainName.set('Dominio desconocido');
      }
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  goBack(): void {
    this.router.navigate(['/platform']);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toggleMenu(commentId: number): void {
    this.activeMenu.set(this.activeMenu() === commentId ? null : commentId);
  }

  deleteComment(commentId: number): void {
    // Eliminar el comentario del array
    this.comments.update(comments => 
      comments.filter(comment => comment.id !== commentId)
    );
    this.activeMenu.set(null);
  }

  goToWeb(): void {
    // Navegar a la web actual
    if (this.fullUrl) {
      window.open(this.fullUrl, '_blank');
    } else if (this.idWeb) {
      // Si es del inbox, construir URL base
      const baseUrl = `https://www.youtube.com/watch?v=${this.idWeb}`;
      window.open(baseUrl, '_blank');
    }
    this.activeMenu.set(null);
  }

  private loadComments(): void {
    this.loading.set(true);
    this.error.set(null);

    // Si tenemos idWeb, cargar del inbox; si no, cargar de implement con fullUrl
    if (this.idWeb) {
      this.loadInboxComments();
    } else if (this.fullUrl) {
      this.loadImplementComments();
    } else {
      this.error.set('No se ha proporcionado Full-URL o idWeb');
      this.loading.set(false);
    }
  }

  private loadInboxComments(): void {
    this.dashboard.getInboxComments(this.idWeb).subscribe({
      next: (res: any[]) => {
        const mapped = res.map((comment: any) => ({
          id: comment.idComment ?? 0,
          username: comment.user ?? 'Anónimo',
          comment: comment.content ?? '',
          date: new Date(comment.created),
          replies: comment.replies ?? 0
        } as Comment));
        this.comments.set(mapped);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading inbox comments', err);
        this.error.set('Error cargando comentarios de la bandeja');
        this.loading.set(false);
      }
    });
  }

  private loadImplementComments(): void {
    // Usamos el endpoint /replies que devuelve root comments + arreglo de replies
    this.api.getReplies(this.fullUrl).subscribe({
      next: (res: CommentResponse[]) => {
        const mapped = res.map(r => ({
          id: r.idComment,
          username: r.user,
          comment: r.content,
          date: new Date(r.created),
          replies: r.replies ?? (r.comments?.length ?? 0)
        } as Comment));
        this.comments.set(mapped);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading comments', err);
        this.error.set('Error cargando comentarios');
        this.loading.set(false);
      }
    });
  }
}